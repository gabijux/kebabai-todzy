using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIngrTableAndFixKebabas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ingridientas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<double>(type: "double precision", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    OutOfDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingridientas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KebabasIngridientas",
                columns: table => new
                {
                    IngridientasId = table.Column<int>(type: "integer", nullable: false),
                    KebabasId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KebabasIngridientas", x => new { x.IngridientasId, x.KebabasId });
                    table.ForeignKey(
                        name: "FK_KebabasIngridientas_Ingridientas_IngridientasId",
                        column: x => x.IngridientasId,
                        principalTable: "Ingridientas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KebabasIngridientas_Kebabas_KebabasId",
                        column: x => x.KebabasId,
                        principalTable: "Kebabas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Ingridientas",
                columns: new[] { "Id", "Amount", "Category", "Name", "OutOfDate", "Price" },
                values: new object[,]
                {
                    { 1, 100.0, 3, "Chicken", new DateTime(2026, 6, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3839), 1.5 },
                    { 2, 100.0, 3, "Beef", new DateTime(2026, 6, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3850), 2.0 },
                    { 3, 50.0, 1, "Lettuce", new DateTime(2026, 2, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3853), 0.5 },
                    { 4, 50.0, 1, "Tomato", new DateTime(2026, 2, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3855), 0.59999999999999998 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_KebabasIngridientas_KebabasId",
                table: "KebabasIngridientas",
                column: "KebabasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KebabasIngridientas");

            migrationBuilder.DropTable(
                name: "Ingridientas");
        }
    }
}
