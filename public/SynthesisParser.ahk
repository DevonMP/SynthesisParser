Gui Add, ActiveX, xm w0 h0 vWB, Shell.Explorer2
Gui, 1:+AlwaysOnTop -Border -SysMenu +Owner -Caption +ToolWindow
WB.Silent := True
#IfWinActive, ahk_class POEWindowClass
^b::
    Send, ^c
    sleep, 100
    Header := "Content-Type: application/x-www-form-urlencoded"
    PostString := "item=" . UriEncode(Clipboard)
    PostData := BinArr_FromString("version=2&item=" . UriEncode(Clipboard))
	;WB.Navigate("http://localhost:3000/itemdataahk",,, PostData, Header)
    WB.Navigate("http://synthesisparser.herokuapp.com/itemdataahk",,, PostData, Header)
    While WB.ReadyState != 4 {
        sleep, 100
    }
    Height := WB.Document.getElementById("possibleMods").offsetHeight
    GuiControl, Move, WB, x0, y0, w300, h%Height%
    WB.Document.body.style.overflow:="hidden"
    MouseGetPos, xpos, ypos 
    xpos := xpos + 30
    Gui, Show, x%xpos% y%ypos% h%Height% w300
    MouseGetPos, StartVarX, StartVarY
    CheckVarX := StartVarX
    CheckVarY := StartVarY
    while (Abs(StartVarX - CheckVarX) < 10 and Abs(StartVarY - CheckVarY) < 10){
        sleep, 100
        MouseGetPos, CheckVarX, CheckVarY
    }
    Gui, Show, Hide

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
