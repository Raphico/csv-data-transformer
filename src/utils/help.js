export function printHelp() {
    const help = `
Usage:
  csv-transform [options]

Options:
  -i, --input <filePath>                    Specify the input CSV file.
  -o, --output <filePath>                   Specify the output file path and format (.csv or .json).

  -f, --filter <condition>                  Filter rows based on a condition (e.g., column=value).
                                            Example: --filter "status=active", --filter "status=active AND sales=100", --filter "status=active OR country=USA"

  -a, --aggregate <type,column>                 Perform aggregation operations on a column.
                                            Available types: sum, avg, min, max
                                            Example: --aggregate "sum,sales"

  --add-column <columnName=defaultValue>    Add a new column with a default value for each row.
                                            Example: --add-column "discount=0"

  --remove-column <columnName>              Remove a specified column.
                                            Example: --remove-column "old_column"

  --rename-column <oldName=newName>         Rename a column.
                                            Example: --rename-column "old_col=new_col"

  -d, --delimiter <character>               Specify the delimiter used in the CSV file (default is comma).
                                            Example: --delimiter ";"

Examples:
  1. Basic usage with filtering and output:
     csv-transform --input data.csv --filter "status=active AND country=USA" --output result.csv

  2. Add a new column and aggregate sales:
     csv-transform --input data.csv --add-column "discount=5" --aggregate "sum,sales" --output summary.json

  3. Remove and rename columns:
     csv-transform --input data.csv --remove-column "old_column" --rename-column "old_name=new_name" --output cleaned.csv
`;

    console.log(help);
}

/**
 * print error message to the stderr
 * @param {string} errorMessage - error message
 * @param {boolean} showHelpCommand - display help command
 */
export function printError(errorMessage, showHelpCommand = true) {
    console.error(`csvtransform: ${errorMessage}`);
    if (showHelpCommand) {
        console.error("Try 'bfr --help' for more information.");
    }
}
