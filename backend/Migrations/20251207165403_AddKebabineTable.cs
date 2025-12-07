using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddKebabineTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kebabines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Rating = table.Column<double>(type: "double precision", nullable: false),
                    OpeningHours = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    EmployeeCount = table.Column<int>(type: "integer", nullable: false),
                    XCoordinate = table.Column<double>(type: "double precision", nullable: false),
                    YCoordinate = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kebabines", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Kebabines",
                columns: new[] { "Id", "Address", "City", "Email", "EmployeeCount", "Name", "OpeningHours", "PhoneNumber", "Rating", "XCoordinate", "YCoordinate" },
                values: new object[,]
                {
                    { 1, "Vilniaus g. 10", "Vilnius", "info@jammi.lt", 5, "Jammi Kebabai", "10:00 - 22:00", "+37060000001", 4.5, 54.687199999999997, 25.279699999999998 },
                    { 2, "Kauno g. 5", "Kaunas", "info@kebabinn.lt", 3, "Kebab Inn", "11:00 - 23:00", "+37060000002", 4.2000000000000002, 54.898499999999999, 23.903600000000001 },
                    { 3, "Taikos pr. 15", "Klaipėda", "info@liuks.lt", 4, "Liuks Kebabai", "09:00 - 00:00", "+37060000003", 4.7999999999999998, 55.703299999999999, 21.144300000000001 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kebabines");
        }
    }
}
