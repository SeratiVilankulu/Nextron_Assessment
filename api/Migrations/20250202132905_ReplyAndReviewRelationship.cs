using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ReplyAndReviewRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReviewId",
                table: "Replies",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Replies_ReviewId",
                table: "Replies",
                column: "ReviewId");

            migrationBuilder.AddForeignKey(
                name: "FK_Replies_Reviews_ReviewId",
                table: "Replies",
                column: "ReviewId",
                principalTable: "Reviews",
                principalColumn: "ReviewId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Replies_Reviews_ReviewId",
                table: "Replies");

            migrationBuilder.DropIndex(
                name: "IX_Replies_ReviewId",
                table: "Replies");

            migrationBuilder.DropColumn(
                name: "ReviewId",
                table: "Replies");
        }
    }
}
