function convert(){
    let csv=document.getElementById("csv").value;
    document.getElementById("sql").value=csvToSql(csv);
}

/**
 * Diese Funktion wandelt eine CSV-codierte Tabelle in eine SQL-Anweisung um, die diese Tabelle erzeugt.
 * @param {*} csv : String mit den csv-Daten
 * 1. Zeile = Name der Tabelle
 * 2. Zeile = Attributnamen
 * 3. Zeile = Datentypen der Attribute
 * @returns : String mit den SQL-Daten
 */
function csvToSql(csv) {
    csv=csv.replaceAll(",",".");
    // Die CSV-Tabelle wird anhand von Zeilenumbrüchen in einzelne Zeilen aufgeteilt.
    const rows = csv.split('\n');
    // Der Name der Tabelle wird aus der ersten Zeile der CSV-Tabelle extrahiert.
    const tableName = rows[0].replace(/[^a-zA-Z0-9]/g, ''); // alle Zeichen, die keine Buchstaben oder Zahlen sind, werden entfernt 
    // Die Spaltennamen werden aus der ersten Zeile der CSV-Tabelle extrahiert und in der SQL-Anweisung verwendet.
    const columns = rows[1].split(';');
    // Die Datentypen werden aus der dritten Zeile der CSV-Tabelle extrahiert und in der SQL-Anweisung verwendet.
    const dataTypes = rows[2].split(';');
    // Die SQL-Anweisung wird mit dem CREATE TABLE-Statement begonnen.
    let sql = `CREATE TABLE ${tableName} (\n`;
    // Für jede Spalte wird ein Spaltenname und der entsprechende Datentyp in der SQL-Anweisung hinzugefügt.
    for (let i = 0; i < columns.length; i++) {
      sql += `  ${columns[i]} ${dataTypes[i]}`;
      if (i !== columns.length - 1) {
        sql += ',\n';
      }
    }
    // Die SQL-Anweisung wird mit einem Semikolon abgeschlossen und um eine Leerzeile ergänzt.
    sql += '\n);\n\n';
    // Für jede Zeile der CSV-Tabelle wird ein INSERT INTO-Statement in der SQL-Anweisung hinzugefügt.
    for (let i = 3; i < rows.length; i++) {
      const values = rows[i].split(';');
      sql += `INSERT INTO ${tableName} VALUES (`;
      // Für jeden Wert in der Zeile wird ein Textwert in der SQL-Anweisung hinzugefügt.
      for (let j = 0; j < values.length; j++) {
        sql += `'${values[j]}'`;
        if (j !== values.length - 1) {
          sql += ', ';
        }
      }
      // Die SQL-Anweisung wird mit einem Semikolon abgeschlossen und um eine Leerzeile ergänzt.
      sql += ');\n';
    }
    // Die fertige SQL-Anweisung wird zurückgegeben.
    return sql;
  }