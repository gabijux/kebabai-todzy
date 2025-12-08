using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddKebabasTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kebabas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Size = table.Column<int>(type: "integer", nullable: true),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Sauce = table.Column<string>(type: "text", nullable: false),
                    Calories = table.Column<int>(type: "integer", nullable: false),
                    Proteins = table.Column<double>(type: "double precision", nullable: false),
                    Fats = table.Column<double>(type: "double precision", nullable: false),
                    Carbohydrates = table.Column<double>(type: "double precision", nullable: false),
                    Spicy = table.Column<bool>(type: "boolean", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kebabas", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Kebabas",
                columns: new[] { "Id", "Calories", "Carbohydrates", "Category", "Description", "Fats", "Name", "Price", "Proteins", "Sauce", "Size", "Spicy" },
                values: new object[,]
                {
                    { 1, 600, 70.0, "Chicken", "A delicious classic chicken kebab with garlic sauce.", 20.0, "Classic Kebab", 5.9900000000000002, 30.0, "Garlic", 1, false },
                    { 2, 700, 60.0, "Beef", "A fiery beef kebab for those who love spice.", 25.0, "Spicy Beef Kebab", 6.4900000000000002, 40.0, "Spicy", 0, true },
                    { 3, 500, 80.0, "Vegetarian", "A healthy and tasty vegetarian kebab with yogurt sauce.", 10.0, "Vegetarian Kebab", 5.4900000000000002, 15.0, "Yogurt", 1, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kebabas");
        }
    }
}
