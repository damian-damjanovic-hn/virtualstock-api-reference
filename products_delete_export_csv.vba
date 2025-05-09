Sub ExportProductsDeleteCSV()
    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim exportPath As String
    Dim fileName As String
    Dim fileNum As Integer
    Dim row As ListRow
    Dim partNumber As String
    Dim accountId As Variant
    Dim recordAction As String
    Dim exportCount As Long
    Dim line As String
    Dim currentDateTime As String

    ' Set worksheet and table
    Set ws = ThisWorkbook.Sheets(1) ' Adjust if needed
    Set tbl = ws.ListObjects("products_delete")

    ' Prepare file path
    currentDateTime = Format(Now, "yyyymmdd_HHmmss")
    fileName = "products_delete_" & currentDateTime & ".csv"
    exportPath = ThisWorkbook.Path & "\" & fileName

    ' Open file for writing
    fileNum = FreeFile
    Open exportPath For Output As #fileNum

    ' Write header
    line = ""
    For i = 1 To tbl.ListColumns.Count
        line = line & tbl.ListColumns(i).Name
        If i < tbl.ListColumns.Count Then line = line & ","
    Next i
    Print #fileNum, line

    ' Loop through rows
    exportCount = 0
    For Each row In tbl.ListRows
        partNumber = Trim(row.Range(1, tbl.ListColumns("part_number").Index).Value)
        accountId = row.Range(1, tbl.ListColumns("account_id").Index).Value
        recordAction = Trim(UCase(row.Range(1, tbl.ListColumns("recordAction").Index).Value))

        If partNumber <> "" And IsNumeric(accountId) And recordAction = "DELETE" Then
            line = ""
            For i = 1 To tbl.ListColumns.Count
                line = line & row.Range(1, i).Value
                If i < tbl.ListColumns.Count Then line = line & ","
            Next i
            Print #fileNum, line
            exportCount = exportCount + 1
        End If
    Next row

    ' Close file
    Close #fileNum

    ' Show success message
    MsgBox exportCount & " row(s) exported to " & fileName, vbInformation, "Export Complete"
End Sub
