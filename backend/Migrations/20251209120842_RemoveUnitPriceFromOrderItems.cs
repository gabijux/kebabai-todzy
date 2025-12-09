using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnitPriceFromOrderItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "OrderItems");

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 1,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 12, 8, 42, 95, DateTimeKind.Utc).AddTicks(1127));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 2,
                column: "OutOfDate",
                value: new DateTime(2026, 6, 9, 12, 8, 42, 95, DateTimeKind.Utc).AddTicks(1147));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 3,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 12, 8, 42, 95, DateTimeKind.Utc).AddTicks(1152));

            migrationBuilder.UpdateData(
                table: "Ingridientas",
                keyColumn: "Id",
                keyValue: 4,
                column: "OutOfDate",
                value: new DateTime(2026, 2, 9, 12, 8, 42, 95, DateTimeKind.Utc).AddTicks(1157));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "OrderItems",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

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
        }
    }
}
