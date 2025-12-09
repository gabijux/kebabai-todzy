namespace BackendApi.Models;

public class CreateOrderRequest
{
    public int? UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    public decimal Amount { get; set; }
    public string? DiscountCode { get; set; }
    public string? ReturnUrl { get; set; }
}

public class CartItemDto
{
    public int KebabasId { get; set; }
    public int Quantity { get; set; }
}
