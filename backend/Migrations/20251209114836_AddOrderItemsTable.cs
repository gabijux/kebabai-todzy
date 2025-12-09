using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderItemsTable : Migration
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
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Kebabas_KebabasId",
                        column: x => x.KebabasId,
                        principalTable: "Kebabas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 1,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 11, 48, 34, 299, DateTimeKind.Utc).AddTicks(8964));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 2,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 11, 48, 34, 299, DateTimeKind.Utc).AddTicks(8992));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 3,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 11, 48, 34, 299, DateTimeKind.Utc).AddTicks(8997));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 4,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 11, 48, 34, 299, DateTimeKind.Utc).AddTicks(9002));

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
