using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    KebabasId = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Kebabas_KebabasId",
                        column: x => x.KebabasId,
                        principalTable: "Kebabas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Carts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 12, 58, 16, 680, DateTimeKind.Utc).AddTicks(7322));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 1,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 12, 58, 16, 678, DateTimeKind.Utc).AddTicks(7644));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 2,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 12, 58, 16, 678, DateTimeKind.Utc).AddTicks(7655));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 3,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 12, 58, 16, 678, DateTimeKind.Utc).AddTicks(7656));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 4,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 12, 58, 16, 678, DateTimeKind.Utc).AddTicks(7657));

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_KebabasId",
                table: "OrderItems",
                column: "KebabasId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.UpdateData(
                table: "Carts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 9, 3, 44, 540, DateTimeKind.Utc).AddTicks(5953));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 1,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 9, 3, 44, 538, DateTimeKind.Utc).AddTicks(5538));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 2,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 9, 3, 44, 538, DateTimeKind.Utc).AddTicks(5549));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 3,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 9, 3, 44, 538, DateTimeKind.Utc).AddTicks(5550));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 4,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 9, 3, 44, 538, DateTimeKind.Utc).AddTicks(5551));
        }
    }
}
