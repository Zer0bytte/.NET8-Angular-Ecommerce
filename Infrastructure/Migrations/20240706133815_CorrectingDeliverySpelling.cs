using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CorrectingDeliverySpelling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeleiveryMethods_DeleiveryMethodId",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "DeleiveryMethodId",
                table: "Orders",
                newName: "DeliveryMethodId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_DeleiveryMethodId",
                table: "Orders",
                newName: "IX_Orders_DeliveryMethodId");

            migrationBuilder.RenameColumn(
                name: "DeleiveryTime",
                table: "DeleiveryMethods",
                newName: "DeliveryTime");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeleiveryMethods_DeliveryMethodId",
                table: "Orders",
                column: "DeliveryMethodId",
                principalTable: "DeleiveryMethods",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeleiveryMethods_DeliveryMethodId",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "DeliveryMethodId",
                table: "Orders",
                newName: "DeleiveryMethodId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_DeliveryMethodId",
                table: "Orders",
                newName: "IX_Orders_DeleiveryMethodId");

            migrationBuilder.RenameColumn(
                name: "DeliveryTime",
                table: "DeleiveryMethods",
                newName: "DeleiveryTime");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeleiveryMethods_DeleiveryMethodId",
                table: "Orders",
                column: "DeleiveryMethodId",
                principalTable: "DeleiveryMethods",
                principalColumn: "Id");
        }
    }
}
