using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Videos_VideoID",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoCategories_Categories_CategoryID",
                table: "VideoCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoCategories_Videos_VideoID",
                table: "VideoCategories");

            migrationBuilder.RenameColumn(
                name: "VideoID",
                table: "VideoCategories",
                newName: "VideoId");

            migrationBuilder.RenameColumn(
                name: "CategoryID",
                table: "VideoCategories",
                newName: "CategoryId");

            migrationBuilder.RenameColumn(
                name: "VideoCategoryID",
                table: "VideoCategories",
                newName: "VideoCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_VideoCategories_VideoID",
                table: "VideoCategories",
                newName: "IX_VideoCategories_VideoId");

            migrationBuilder.RenameIndex(
                name: "IX_VideoCategories_CategoryID",
                table: "VideoCategories",
                newName: "IX_VideoCategories_CategoryId");

            migrationBuilder.RenameColumn(
                name: "VideoID",
                table: "Reviews",
                newName: "VideoId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_VideoID",
                table: "Reviews",
                newName: "IX_Reviews_VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Videos_VideoId",
                table: "Reviews",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_VideoCategories_Categories_CategoryId",
                table: "VideoCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoCategories_Videos_VideoId",
                table: "VideoCategories",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "VideoId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Videos_VideoId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoCategories_Categories_CategoryId",
                table: "VideoCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoCategories_Videos_VideoId",
                table: "VideoCategories");

            migrationBuilder.RenameColumn(
                name: "VideoId",
                table: "VideoCategories",
                newName: "VideoID");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "VideoCategories",
                newName: "CategoryID");

            migrationBuilder.RenameColumn(
                name: "VideoCategoryId",
                table: "VideoCategories",
                newName: "VideoCategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_VideoCategories_VideoId",
                table: "VideoCategories",
                newName: "IX_VideoCategories_VideoID");

            migrationBuilder.RenameIndex(
                name: "IX_VideoCategories_CategoryId",
                table: "VideoCategories",
                newName: "IX_VideoCategories_CategoryID");

            migrationBuilder.RenameColumn(
                name: "VideoId",
                table: "Reviews",
                newName: "VideoID");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_VideoId",
                table: "Reviews",
                newName: "IX_Reviews_VideoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Videos_VideoID",
                table: "Reviews",
                column: "VideoID",
                principalTable: "Videos",
                principalColumn: "VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_VideoCategories_Categories_CategoryID",
                table: "VideoCategories",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoCategories_Videos_VideoID",
                table: "VideoCategories",
                column: "VideoID",
                principalTable: "Videos",
                principalColumn: "VideoId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
