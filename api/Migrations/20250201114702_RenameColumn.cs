using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
  /// <inheritdoc />
  public partial class RenameColumn : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.AddColumn<TimeSpan>(
          name: "videoDuration",
          table: "Videos",
          type: "interval",
          nullable: false,
          defaultValue: new TimeSpan(0, 0, 0, 0, 0));

      migrationBuilder.RenameColumn(
          name: "CreateAt", 
          table: "Videos", 
          newName: "CreatedAt" 
);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropColumn(
          name: "videoDuration",
          table: "Videos");

      migrationBuilder.RenameColumn(
        name: "CreatedAt",  
        table: "Videos", 
        newName: "CreateAt" 
    );
    }
  }
}
