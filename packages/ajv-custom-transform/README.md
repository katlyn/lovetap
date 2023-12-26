# ajv-custom-transform

`ajv-custom-transform` is a simple AJV keyword implementation that allows value transformations to be defined in JSON
schema. Currently, it is only used to convert timestamp strings to `Date` objects.

## Usage
Set the `customTransform` property for a key to one of the following transform values. Upon validation of a value with
AJV, the property will be transformed according to the specified rules.

### Available Transformations
#### `date-time`
Converts a `string` into a `Date` object using `new Date(value)`.
