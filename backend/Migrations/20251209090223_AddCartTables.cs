using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCartTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CartId = table.Column<int>(type: "integer", nullable: false),
                    KebabasId = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Kebabas_KebabasId",
                        column: x => x.KebabasId,
                        principalTable: "Kebabas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 1,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 9, 2, 23, 133, DateTimeKind.Utc).AddTicks(1107));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 2,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 9, 2, 23, 133, DateTimeKind.Utc).AddTicks(1117));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 3,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 9, 2, 23, 133, DateTimeKind.Utc).AddTicks(1118));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 4,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 9, 2, 23, 133, DateTimeKind.Utc).AddTicks(1119));

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_KebabasId",
                table: "CartItems",
                column: "KebabasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 1,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3839));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 2,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3850));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 3,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3853));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 4,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 8, 14, 56, 30, 98, DateTimeKind.Utc).AddTicks(3855));
        }
    }
}
