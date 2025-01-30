using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdateAt",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "Updated",
                table: "Reviews");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "UpdateAt",
                table: "Videos",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Updated",
                table: "Reviews",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
