using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedCartRows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Carts",
                columns: new[] { "Id", "CreatedAt", "UserId" },
                values: new object[] { 1, new DateTime(2025, 12, 9, 9, 3, 44, 540, DateTimeKind.Utc).AddTicks(5953), null });

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

            migrationBuilder.InsertData(
                table: "CartItems",
                columns: new[] { "Id", "CartId", "KebabasId", "Quantity" },
                values: new object[] { 1, 1, 1, 2 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CartItems",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Carts",
                keyColumn: "Id",
                keyValue: 1);

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
        }
    }
}
