using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddingProfileImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "62d38ce6-6265-4181-bbcd-51f948713d9c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7c9b6893-510b-4fc4-88b1-52e5758ce52a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a1f75c23-b7ad-43a3-925d-c8c417e8b9b7", null, "User", "USER" },
                    { "d2f32c28-5d6f-4e44-98b9-9a3e5f89cd9a", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a1f75c23-b7ad-43a3-925d-c8c417e8b9b7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d2f32c28-5d6f-4e44-98b9-9a3e5f89cd9a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "62d38ce6-6265-4181-bbcd-51f948713d9c", null, "Admin", "ADMIN" },
                    { "7c9b6893-510b-4fc4-88b1-52e5758ce52a", null, "User", "USER" }
                });
        }
    }
}
