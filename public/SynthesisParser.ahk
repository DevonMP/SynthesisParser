ie := ComObjCreate("InternetExplorer.Application")
ie.AddressBar := False
ie.ToolBar := False
ie.MenuBar := False
ie.StatusBar := False
ie.Visible := false  ; This is known to work incorrectly on IE7.
ie.Width := 300
ie.Height := 300
hwnd := ie.hwnd
ie.Left := -5000
ie.Top := -5000
ie.Visible := True
Winset, Style, -0xC40000, ahk_id %hwnd%
Winset, Alwaysontop, , ahk_id %hwnd%
WinSet, ExStyle, ^0x80, ahk_id %hwnd%
sleep, 10
ie.Visible := False

#IfWinActive, ahk_class POEWindowClass
^a::
    ie.Visible := False
    MouseGetPos, xpos, ypos 
    ie.Left := xpos
    ie.Top := ypos
    Header := "Content-Type: application/x-www-form-urlencoded"
    Send, ^c
    sleep, 10
    PostData := BinArr_FromString("item=" . Clipboard)
    ie.Navigate("http://localhost:3000/itemdataahk",,, PostData, Header)
    While ie.ReadyState != 4 {
        sleep, 100
    }
    ie.Visible := True


BinArr_FromString(str) {
	oADO := ComObjCreate("ADODB.Stream")

	oADO.Type := 2 ; adTypeText
	oADO.Mode := 3 ; adModeReadWrite
	oADO.Open
	oADO.Charset := "UTF-8"
	oADO.WriteText(str)

	oADO.Position := 0
	oADO.Type := 1 ; adTypeBinary
	oADO.Position := 3 ; Skip UTF-8 BOM
	return oADO.Read, oADO.Close
}