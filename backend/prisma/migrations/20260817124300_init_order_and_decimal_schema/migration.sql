BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'STAFF',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[categories] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [categories_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [categories_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [categories_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[menu_items] (
    [id] NVARCHAR(1000) NOT NULL,
    [itemCode] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(12,2) NOT NULL,
    [stock] INT NOT NULL CONSTRAINT [menu_items_stock_df] DEFAULT 0,
    [imageUrl] NVARCHAR(1000),
    [categoryId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [menu_items_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [menu_items_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [menu_items_itemCode_key] UNIQUE NONCLUSTERED ([itemCode])
);

-- CreateTable
CREATE TABLE [dbo].[tables] (
    [id] INT NOT NULL IDENTITY(1,1),
    [number] INT NOT NULL,
    [capacity] INT NOT NULL CONSTRAINT [tables_capacity_df] DEFAULT 4,
    [isOccupied] BIT NOT NULL CONSTRAINT [tables_isOccupied_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [tables_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [tables_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [tables_number_key] UNIQUE NONCLUSTERED ([number])
);

-- CreateTable
CREATE TABLE [dbo].[orders] (
    [id] NVARCHAR(1000) NOT NULL,
    [orderNumber] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [orders_status_df] DEFAULT 'PENDING',
    [paymentStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [orders_paymentStatus_df] DEFAULT 'UNPAID',
    [totalAmount] DECIMAL(12,2) NOT NULL CONSTRAINT [orders_totalAmount_df] DEFAULT 0.00,
    [tableId] INT,
    [userId] NVARCHAR(1000),
    [note] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [orders_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [orders_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [orders_orderNumber_key] UNIQUE NONCLUSTERED ([orderNumber])
);

-- CreateTable
CREATE TABLE [dbo].[order_items] (
    [id] NVARCHAR(1000) NOT NULL,
    [orderId] NVARCHAR(1000) NOT NULL,
    [menuItemId] NVARCHAR(1000) NOT NULL,
    [quantity] INT NOT NULL CONSTRAINT [order_items_quantity_df] DEFAULT 1,
    [price] DECIMAL(12,2) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [order_items_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [order_items_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[menu_items] ADD CONSTRAINT [menu_items_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[categories]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [orders_tableId_fkey] FOREIGN KEY ([tableId]) REFERENCES [dbo].[tables]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [orders_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [order_items_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[orders]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [order_items_menuItemId_fkey] FOREIGN KEY ([menuItemId]) REFERENCES [dbo].[menu_items]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
