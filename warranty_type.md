The `default` keyword is used properly to specify `"REPAIR"` as the default value when the field is missing. If invalid value is entered Virtualstock will provide consistent validation error message.

JSON Schema snippet:

```JSON
"warranty_type": {
  "type": "string",
  "enum": ["REPAIR", "REPLACE"],
  "default": "REPAIR",
  "description": "Warranty type must be one of: REPAIR or REPLACE"
}

```

### Example Scenarios:

1.  **If `warranty_type` is missing**: Input:
    
    ```JSON
    {}
    ```
    
    Output after applying defaults:
    
    ```json
    { "warranty_type": "REPAIR"}
    ```
    
2.  **If `warranty_type` is provided**: Input:
    
    ```json
    { "warranty_type": "REPLACE"}
    ```
    
    Output:
    
    ```json
    { "warranty_type": "REPLACE"}
    ```
    
3.  **If an invalid value is provided**: Input:
    
    ```json
    { "warranty_type": "OTHER"}
    ```
    
    Validation Error:
    
    ```csharp
    Value 'OTHER' is not valid for 'warranty_type'. Must be one of: REPAIR, REPLACE.
    ```
    

* * *
