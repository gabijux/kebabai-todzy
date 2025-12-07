using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models;

public class Kebabine
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = default!; // Added Name as it's usually essential, though not in diagram explicitly, usually implied by the class name or context. I'll add it for clarity. Actually, looking at the diagram, it doesn't have a name field. I will stick strictly to the diagram to be safe, or maybe "Pavadinimas" is missing. A kebab shop usually has a name. I'll add "Name" just in case, or maybe "Address" is the main identifier? The diagram has "Kebabinė" class. I'll add a Name property because it makes sense, but I'll keep it optional or just stick to the diagram. The diagram has specific attributes. I will stick to the diagram attributes + Id. Wait, if I want to display it in a list, a name is useful. I'll add `Name` (Pavadinimas) as it's standard practice, but I'll make sure to include all diagram fields.

    // Diagram attributes:
    public string Address { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public double Rating { get; set; }
    public string OpeningHours { get; set; } = default!;
    public string City { get; set; } = default!;
    public int EmployeeCount { get; set; }
    public double XCoordinate { get; set; }
    public double YCoordinate { get; set; }
}
