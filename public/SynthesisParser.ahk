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
displaying := False

#IfWinActive, ahk_class POEWindowClass
^b::
    displaying:= True
    MouseGetPos, xpos, ypos 
    ie.Left := xpos + 10
    ie.Top := ypos + 10
    Header := "Content-Type: application/x-www-form-urlencoded"
    Send, ^c
    sleep, 10
    PostData := BinArr_FromString("item=" . UriEncode(Clipboard))
    ;ie.Navigate("http://localhost:3000/itemdataahk",,, PostData, Header)
    ie.Navigate("http://synthesisparser.herokuapp.com/itemdataahk",,, PostData, Header)
    While ie.ReadyState != 4 {
        sleep, 100
    }
    ie.Visible := True
    MouseGetPos, StartVarX, StartVarY
    CheckVarX := StartVarX
    CheckVarY := StartVarY
    while (StartVarX = CheckVarX and StartVarY = CheckVarY){
        sleep, 100
        MouseGetPos, StartVarX, StartVarY
    }
    ie.Visible := False

MouseMove() {
	if (displaying != false) {
        displaying :=false
        ie.Visible := False
    }
}

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

UriEncode(Uri, Enc = "UTF-8")
{
	StrPutVar(Uri, Var, Enc)
	f := A_FormatInteger
	SetFormat, IntegerFast, H
	Loop
	{
		Code := NumGet(Var, A_Index - 1, "UChar")
		If (!Code)
			Break
		If (Code >= 0x30 && Code <= 0x39 ; 0-9
			|| Code >= 0x41 && Code <= 0x5A ; A-Z
			|| Code >= 0x61 && Code <= 0x7A) ; a-z
			Res .= Chr(Code)
		Else
			Res .= "%" . SubStr(Code + 0x100, -1)
	}
	SetFormat, IntegerFast, %f%
	Return, Res
}
StrPutVar(Str, ByRef Var, Enc = "")
{
	Len := StrPut(Str, Enc) * (Enc = "UTF-16" || Enc = "CP1200" ? 2 : 1)
	VarSetCapacity(Var, Len, 0)
	Return, StrPut(Str, &Var, Enc)
}