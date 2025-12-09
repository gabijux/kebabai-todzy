namespace BackendApi.Models;

public class RemoveFromCartRequest
{
    public int? UserId { get; set; }
    public int KebabasId { get; set; }
    public bool RemoveAll { get; set; } = false;
}
