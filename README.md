# CSV Data Transformer

A Node.js CLI tool for transforming and processing large CSV files. Supports filtering, aggregating, and modifying CSV data efficiently using streams. Ideal for processing data in various formats, cleaning, and preparing it for further use.

## Features

-   **Filter rows** based on column values.
-   **Aggregate data** (e.g., sum, average) by specific columns.
-   **Add, remove, or rename columns.**
-   **Modify column values** with custom expressions.
-   **Export** to CSV or JSON formats.

## Installation

1. clone repository

```bash
git clone git@github.com:Raphico/csv-data-transformer.git
cd csv-data-transformer
```

2. install dependencies

```bash
npm install
```

3. create symlink

```bash
npm link
```

## Usage

```bash
csvtransform --help
```

## Commands

| Command                                   | Description                                                    | Example                                                                                                      |
| ----------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `--input <filePath>`                      | Specifies the CSV file to process.                             | `--input data.csv`                                                                                           |
| `--output <filePath>`                     | Specifies the output file path and format (`.csv` or `.json`). | `--output result.json`                                                                                       |
| `--filter <condition>`                    | Filters rows based on a condition (e.g., `column=value`).      | `--filter "status=active", --filter "status=active OR country=USA", --filter "status=active AND country=USA` |
| `--aggregate <type,column>`               | Aggregates data, e.g., `sum`, `average` on a column.           | `--aggregate "sum,sales"`                                                                                    |
| `--add-column <columnName=defaultValue>`  | Adds a new column with a default value.                        | `--add-column "discount=0"`                                                                                  |
| `--remove-column <columnName>`            | Removes a specified column.                                    | `--remove-column "old_column"`                                                                               |
| `--rename-column <oldName=newName>`       | Renames a column.                                              | `--rename-column "old_col=new_col"`                                                                          |
| `--modify-column <columnName,expression>` | Modifies column values by expression.                          | `--modify-column "price,*1.2"`                                                                               |
| `--delimiter <character>`                 | Specifies the CSV delimiter (default is a comma).              | `--delimiter ";"`                                                                                            |
