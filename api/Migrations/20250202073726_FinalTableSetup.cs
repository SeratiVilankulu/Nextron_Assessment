using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class FinalTableSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Videos");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Videos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Reviews",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_AppUserId",
                table: "Videos",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_AppUserId",
                table: "Reviews",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AppUser_AppUserId",
                table: "Reviews",
                column: "AppUserId",
                principalTable: "AppUser",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_AppUser_AppUserId",
                table: "Videos",
                column: "AppUserId",
                principalTable: "AppUser",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AppUser_AppUserId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_AppUser_AppUserId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_AppUserId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_AppUserId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Reviews");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Videos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
