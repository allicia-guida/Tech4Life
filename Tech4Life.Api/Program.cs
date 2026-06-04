using Microsoft.EntityFrameworkCore;
using Tech4Life.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tech4life.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();
app.UseCors("AllowAll");


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    EnsureDatabaseSchema(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

static void EnsureDatabaseSchema(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    connection.Open();

    try
    {
        ExecuteSql(db, """
            CREATE TABLE IF NOT EXISTS "Empresas" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_Empresas" PRIMARY KEY AUTOINCREMENT,
                "RazaoSocial" TEXT NOT NULL,
                "NomeFantasia" TEXT NOT NULL,
                "CNPJ" TEXT NOT NULL,
                "Telefone" TEXT NOT NULL,
                "Cidade" TEXT NOT NULL,
                "Estado" TEXT NOT NULL,
                "DataCadastro" TEXT NOT NULL
            );
            """);

        AddColumnIfMissing(db, "Usuarios", "Nivel", """TEXT NOT NULL DEFAULT 'admin'""");
        AddColumnIfMissing(db, "Usuarios", "Ativo", """INTEGER NOT NULL DEFAULT 1""");
        AddColumnIfMissing(db, "Clientes", "Cidade", """TEXT NOT NULL DEFAULT ''""");
        AddColumnIfMissing(db, "Clientes", "Estado", """TEXT NOT NULL DEFAULT ''""");

        ExecuteSql(db, """UPDATE "Usuarios" SET "Nivel" = 'admin' WHERE "Nivel" IS NULL OR "Nivel" = '';""");
        ExecuteSql(db, """UPDATE "Usuarios" SET "Ativo" = 1 WHERE "Ativo" IS NULL;""");
    }
    finally
    {
        connection.Close();
    }
}

static void AddColumnIfMissing(AppDbContext db, string table, string column, string definition)
{
    if (ColumnExists(db, table, column))
        return;

    ExecuteSql(db, $"""ALTER TABLE "{table}" ADD COLUMN "{column}" {definition};""");
}

static bool ColumnExists(AppDbContext db, string table, string column)
{
    using var command = db.Database.GetDbConnection().CreateCommand();
    command.CommandText = $"""PRAGMA table_info("{table}");""";

    using var reader = command.ExecuteReader();
    while (reader.Read())
    {
        if (string.Equals(reader["name"]?.ToString(), column, StringComparison.OrdinalIgnoreCase))
            return true;
    }

    return false;
}

static void ExecuteSql(AppDbContext db, string sql)
{
    using var command = db.Database.GetDbConnection().CreateCommand();
    command.CommandText = sql;
    command.ExecuteNonQuery();
}
