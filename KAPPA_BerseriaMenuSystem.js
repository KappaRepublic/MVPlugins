/*:
* @plugindesc Tales of Berseria Menu System
* @author KappaRepublc
*
* @param <Image Mods>
*
* @param Menu Background
* @desc The graphic used as the background of the menu.
* If no value is provided, the MV default will be used.
* @default 
*
* @param Menu Overlay
* @desc The graphic used as the overlay for the menu.
* If no value is provided, no overlay is used.
* @default 
*
* @param Max Visible Actors
* @desc The amount of actors visible on screen at a time.
* @default 4
*
* @param <Status Mods>
*
* @param Show Actor Name
* @desc Show actor's name in the menu?
* Default is true.
* @default true
*
* @param Show Actor Class
* @desc Show actor's class in the menu?
* Default is true.
* @default true
*
* @param Show Actor Level
* @desc Show actor's level in the menu?
* Default is true.
* @default true
*
* @param Show Actor HP
* @desc Show actor's HP in the menu?
* Default is true.
* @default true
*
* @param Show Actor MP
* @desc Show actor's MP in the menu?
* Default is true.
* @default true
*
* @param Show Actor TP
* @desc Show actor's TP in the menu?
* Default is false.
* @default false
*
* @param Show Actor States
* @desc Show actor's States in the menu?
* Default is true.
* @default true
*
* @param <Command Mods>
*
* @param Item Icon
* @desc The index of the icon representing Item.
* Right click and select IconSet Viewer.
* @default 208
*
* @param Item Help Description
* @desc Text to show when Item is selected
* @default View and manage inventory.
*
* @param Skill Icon
* @desc The index of the icon representing Skills.
* Right click and select IconSet Viewer.
* @default 79
*
* @param Skill Help Description
* @desc Text to show when Skill is selected
* @default View party member's spells and abilities.
*
* @param Equip Icon
* @desc The index of the icon representing Equip.
* Right click and select IconSet Viewer.
* @default 97
*
* @param Equip Help Description
* @desc Text to show when Equip is selected
* @default View and change party member's equipment.
*
* @param Status Icon
* @desc The index of the icon representing Status.
* Right click and select IconSet Viewer.
* @default 84
*
* @param Status Help Description
* @desc Text to show when Status is selected
* @default View the detailed stats of a party member.
*
* @param Formation Icon
* @desc The index of the icon representing Formation.
* Right click and select IconSet Viewer.
* @default 75
*
* @param Formation Help Description
* @desc Text to show when Formation is selected
* @default Change party battle formation.
*
* @param System Icon
* @desc The index of the icon representing System.
* Right click and select IconSet Viewer.
* @default 83
*
* @param System Help Description
* @desc Text to show when System is selected
* @default View and change game options.
*
* @param Save Icon
* @desc The index of the icon representing Save.
* Right click and select IconSet Viewer.
* @default 73
*
* @param Save Help Description
* @desc Text to show when Save is selected
* @default Save the game.
*
* @param Load Icon
* @desc The index of the icon representing Load.
* Right click and select IconSet Viewer.
* @default 74
*
* @param Load Help Description
* @desc Text to show when Load is selected
* @default Load a saved game.
*
* @param Quit Icon
* @desc The index of the icon representing Quit.
* Right click and select IconSet Viewer.
* @default 82
*
* @param Quit Help Description
* @desc Text to show when Quit is selected
* @default Quit the game.
*
* @param <Command Mods Plus>
*
* @param Custom 1 Symbol
* @desc The index of the icon representing Quit.
* Right click and select IconSet Viewer.
* @default 
*
* @param Custom 1 Icon
* @desc The index of the icon representing Quit.
* Right click and select IconSet Viewer.
* @default 
*
* @param Custom 1 Description
* @desc Text to show when Quit is selected
* @default
*
* @help
*/

(function () {

	// Get the user provided parameters.
	var _parameters = PluginManager.parameters('KAPPA_BerseriaMenuSystem');
	var _menuBackground = String(_parameters['Menu Background']);
	var _menuOverlay = String(_parameters['Menu Overlay']);
	var _maxVisibleActors = Number(_parameters['Max Visible Actors']);
	var _showName = String(_parameters['Show Actor Name']).trim() == "true";
	var _showClass = String(_parameters['Show Actor Class']).trim() == "true";
	var _showLevel = String(_parameters['Show Actor Level']).trim() == "true";
	var _showHP = String(_parameters['Show Actor HP']).trim() == "true";
	var _showMP = String(_parameters['Show Actor MP']).trim() == "true";
	var _showTP = String(_parameters['Show Actor TP']).trim() == "true";
	var _showStates = String(_parameters['Show Actor States']).trim() == "true";

	var _icons = {};
	_icons['item'] = Number(_parameters['Item Icon']);
	_icons['skill'] = Number(_parameters['Skill Icon']);
	_icons['equip'] = Number(_parameters['Equip Icon']);
	_icons['status'] = Number(_parameters['Status Icon']);
	_icons['formation'] = Number(_parameters['Formation Icon']);
	_icons['options'] = Number(_parameters['System Icon']);
	_icons['save'] = Number(_parameters['Save Icon']);
	_icons['load'] = Number(_parameters['Load Icon']);
	_icons['gameEnd'] = Number(_parameters['Quit Icon']);

	var _desc = {};
	_desc['item'] = String(_parameters['Item Help Description']);
	_desc['skill'] = String(_parameters['Skill Help Description']);
	_desc['equip'] = String(_parameters['Equip Help Description']);
	_desc['status'] = String(_parameters['Status Help Description']);
	_desc['formation'] = String(_parameters['Formation Help Description']);
	_desc['options'] = String(_parameters['System Help Description']);
	_desc['save'] = String(_parameters['Save Help Description']);
	_desc['load'] = String(_parameters['Load Help Description']);
	_desc['gameEnd'] = String(_parameters['Quit Help Description']);

	// Image manager load background function
	ImageManager.loadMenuImage = function(filename, hue) {
    	return this.loadBitmap('img/pictures/', filename, hue, true);
	};

	//=============================================================================
	// Scene_Menu
	//=============================================================================

	var _Scene_Menu_create_Berseria = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		this.createBackground();
	    Scene_MenuBase.prototype.create.call(this);
	    
	    this.createStatusWindow();
	    this.createCommandWindow();
	    this.createGoldWindow();
	    this.createPlaytimeWindow();
	    this.createCommandLabelWindow();
	    this.createOverlay();
	    this.createInfoMenu();
	};

	var _Scene_Menu_createCommandWindow_Berseria = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
	    this._commandWindow = new Window_MenuCommand(0, 0);
	    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
	    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
	    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
	    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
	    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
	    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
	    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
	    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
	    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
	    this._commandWindow.x = (Graphics.boxWidth - (this._commandWindow.width / 2) - this._commandWindow.width)
	    this._commandWindow.y = -48;
	    this._commandWindow.opacity = 0;
	    this.addChild(this._commandWindow);
	};

	var _Scene_Menu_createStatusWindow_Berseria = Scene_Menu.prototype.createStatusWindow;
	Scene_Menu.prototype.createStatusWindow = function() {
	    this._statusWindow = new Window_MenuStatus((Graphics.boxWidth / (_maxVisibleActors + 1)) / 2, 0);
	    this._statusWindow.opacity = 0;
	    this._statusWindow.y = 48;
	    this.addChild(this._statusWindow);
	};

	var _Scene_Menu_createGoldWindow_Berseria = Scene_Menu.prototype.createGoldWindow;
	Scene_Menu.prototype.createGoldWindow = function() {
	    this._goldWindow = new Window_MenuGold(0, 0);
	    this._goldWindow.x = Graphics.boxWidth - (this._goldWindow.width * 2) - ((Graphics.boxWidth / (_maxVisibleActors + 1)) / 2.75);
	    this._goldWindow.y = Graphics.boxHeight - (this._goldWindow.height * 1.5);
	    this._goldWindow.opacity = 0;
	    this.addChild(this._goldWindow);
	};

	Scene_Menu.prototype.createPlaytimeWindow = function() {
		this._playtimeWindow = new Window_MenuPlaytime(0, 0);
		this._playtimeWindow.x = this._goldWindow.width + this._goldWindow.x;
		this._playtimeWindow.y = this._goldWindow.y;
		this._playtimeWindow.opacity = 0;
		this.addChild(this._playtimeWindow);
	};

	Scene_Menu.prototype.createCommandLabelWindow = function() {
		this._commandLabelWindow = new Window_CommandLabel(0, 0, this._commandWindow);
		this._commandLabelWindow.y = this._commandWindow.height * 0.5;
		this._commandLabelWindow.opacity = 0;
		this.addChild(this._commandLabelWindow);
	};

	Scene_Menu.prototype.createInfoMenu = function() {
		this._infoWindow = new Window_MenuInfo(0, 0, this._commandWindow);
		this._infoWindow.y = Graphics.boxHeight - this._infoWindow.height + 8;
		this._infoWindow.x = - 48;
		this._infoWindow.opacity = 0;
		this.addChild(this._infoWindow);
	};

	// Create the menu background
	Scene_Menu.prototype.createBackground = function(){
		this._backgroundSprite = new Sprite();
		if (_menuBackground == ""){
			this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		}
		else {
			this._backgroundSprite.bitmap = ImageManager.loadMenuImage(_menuBackground);
		};
		this.addChild(this._backgroundSprite);
	};

	// Create the menu overlay
	Scene_Menu.prototype.createOverlay = function() {
		this._overlaySprite = new Sprite();
		if (_menuOverlay == ""){
			// Do nothing
		}
		else {
			this._overlaySprite.bitmap = ImageManager.loadMenuImage(_menuOverlay);
			this.addChild(this._overlaySprite);
		};
	};

	// Refresh the menu every frame
	Scene_Menu.prototype.update = function(){
		this.updateChildren();
		this._playtimeWindow.refresh();
		this._commandLabelWindow.refresh();
		this._infoWindow.refresh();
	};

	//=============================================================================
	// Window_MenuCommand
	//=============================================================================

	Window_MenuCommand.prototype.windowWidth = function() {
    	return ((this.maxItems() * (this.itemWidth() + (this.textPadding() * 2))) + 
	    	(this.standardPadding() * 2)) - (this.textPadding() * 2);
	};

	Window_MenuCommand.prototype.numVisibleRows = function() {
	    return 1;
	};

	Window_MenuCommand.prototype.maxCols = function() {
	    return this.maxItems();
	};

	Window_MenuCommand.prototype.itemWidth = function() {
	    return Window_Base._iconWidth + 4;
	};

	Window_MenuCommand.prototype.itemHeight = function() {
	    return Window_Base._iconHeight + 4;
	};

	Window_MenuCommand.prototype.drawItem = function(index) {
	    var rect = this.itemRectForText(index);
	    var align = this.itemTextAlign();
	    var symbol = this.commandSymbol(index);
	    var enabled = this.isCommandEnabled(index);
	    this.resetTextColor();
		var bitmap = ImageManager.loadSystem('IconSet');
	    var pw = Window_Base._iconWidth;
	    var ph = Window_Base._iconHeight;
	    var sx = _icons[symbol] % 16 * pw;
	    var sy = Math.floor(_icons[symbol] / 16) * ph;
	    if(!enabled) this.contents.paintOpacity = 100;
	    this.contents.blt(bitmap, sx, sy, pw, ph, rect.x - 4, rect.y + 2);
	    if(!enabled) this.contents.paintOpacity = 255;
	};

	Window_MenuCommand.prototype.update = function () {
		Window_Selectable.prototype.update.call(this);
		if (this.y < 0)
		{
			this.y = this.y + 3;
		};
	};

	//=============================================================================
	// Window_MenuStatus
	//=============================================================================

	var _Window_MenuStatus_windowWidth_Berseria = Window_MenuStatus.prototype.windowWidth;
	Window_MenuStatus.prototype.windowWidth = function() {
    	return ((Graphics.boxWidth / (_maxVisibleActors + 1)) * _maxVisibleActors);
	};

	var _Window_MenuStatus_windowHeight_Berseria = Window_MenuStatus.prototype.windowHeight;
	Window_MenuStatus.prototype.windowHeight = function() {
	    return Graphics.boxHeight;
	};

	var _Window_MenuStatus_numVisibleRows_Berseria = Window_MenuStatus.prototype.numVisibleRows;
	Window_MenuStatus.prototype.numVisibleRows = function() {
    	return 1;
	};

	Window_MenuStatus.prototype.maxCols = function() {
    	return _maxVisibleActors;
	};

	Window_MenuStatus.prototype.standardPadding = function(){
		return 0;
	};

	Window_MenuStatus.prototype.textPadding = function(){
		return 0;
	};

	Window_MenuStatus.prototype.spacing = function() {
	    return 0;
	};

	var _Window_MenuStatus_drawItem_Berseria = Window_MenuStatus.prototype.drawItem;
	Window_MenuStatus.prototype.drawItem = function(index) {
	    this.drawItemBackground(index);
	    this.drawItemImage(index);
	    this.drawItemStatus(index);
	};

	var _Window_MenuStatus_drawItemBackground_Berseria = Window_MenuStatus.prototype.drawItemBackground;
	Window_MenuStatus.prototype.drawItemBackground = function(index) {
	    if (index === this._pendingIndex) {
	        var rect = this.itemRect(index);
	        var color = this.pendingColor();
	        this.changePaintOpacity(false);
	        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
	        this.changePaintOpacity(true);
	    }
	};

	var _Window_MenuStatus_drawItemImage_Berseria = Window_MenuStatus.prototype.drawItemImage;
	Window_MenuStatus.prototype.drawItemImage = function(index) {
	    var actor = $gameParty.members()[index];
	    var rect = this.itemRect(index);
	    // this.changePaintOpacity(actor.isBattleMember());
	    var actorBitmapName = $dataActors[actor.actorId()].meta.menu_picture;
		var bitmap = actorBitmapName ? ImageManager.loadPicture(actorBitmapName) : null;
		console.log(bitmap);
        var w = Math.min(rect.width, (actorBitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (actorBitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if (bitmap){
        	var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, 0, 0, w, h, dx, dy);
        }
        else {

        };
        this.changePaintOpacity(true);
	    // this.changePaintOpacity(true);
	};

	var _Window_MenuStatus_drawItemStatus_Berseria = Window_MenuStatus.prototype.drawItemStatus;
	Window_MenuStatus.prototype.drawItemStatus = function(index) {
	    var actor = $gameParty.members()[index];
	    var rect = this.itemRect(index);
	    var x = rect.x + 4;
	    var y = rect.y;
	    var width = rect.width - x - this.textPadding();
	    this.drawActorSimpleStatus(actor, x, y, width);
	};

	Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width){
		var lineHeight = this.lineHeight();
		var gaugeWidth = (Graphics.boxWidth / (_maxVisibleActors + 1)) - 9;

		var offset = 4;
		if(_showTP){
			this.drawActorTp(actor, x, Graphics.boxHeight - lineHeight * offset, gaugeWidth);
			offset = offset + 1;
		};
		if(_showMP){
			this.drawActorMp(actor, x, Graphics.boxHeight - lineHeight * offset, gaugeWidth);
			offset = offset + 1;
		};
		if(_showHP){
			this.drawActorHp(actor, x, Graphics.boxHeight - lineHeight * offset, gaugeWidth);
			offset = offset + 1;
		};
		if(_showClass){
			this.drawActorClass(actor, x, Graphics.boxHeight - lineHeight * offset);
			offset = offset + 1;
		};
		if(_showName){
			this.drawActorName(actor, x, Graphics.boxHeight - lineHeight * offset);
			offset = offset + 1;
		};
		if(_showLevel){
			this.drawActorLevel(actor, x + gaugeWidth - 64,  Graphics.boxHeight - lineHeight * offset)
		};
		if(_showStates){
			this.drawActorIcons(actor, x, Graphics.boxHeight - lineHeight * offset);
		};
	}

	Window_MenuStatus.prototype.drawActorHp = function(actor, x, y, width) {
	    width = width || 186;
	    var color1 = this.hpGaugeColor1();
	    var color2 = this.hpGaugeColor2();
	    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.hpA, x, y, 44);
	    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
	                           this.hpColor(actor), this.normalColor());
	};

	Window_MenuStatus.prototype.drawActorMp = function(actor, x, y, width) {
	    width = width || 186;
	    var color1 = this.mpGaugeColor1();
	    var color2 = this.mpGaugeColor2();
	    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.mpA, x, y, 44);
	    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
	                           this.mpColor(actor), this.normalColor());
	};

	Window_MenuStatus.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
	    var labelWidth = this.textWidth('HP');
	    var valueWidth = this.textWidth('0000');
	    var slashWidth = this.textWidth('/');
	    var x1 = x + width - valueWidth;
	    var x2 = x1 - slashWidth;
	    var x3 = x2 - valueWidth;
	    if (x3 >= x + labelWidth) {
	        this.changeTextColor(color1);
	        this.contents.fontSize = this.standardFontSize() / 1;
	        this.drawText(current, x3 + 16, y, valueWidth, 'right');
	        this.changeTextColor(color2);
	        this.drawText('/', x2 + 16, y, slashWidth, 'right');
	        this.contents.fontSize = this.standardFontSize() / 1.5;
	        this.drawText(max, x1, y + 3, valueWidth, 'right');
	        this.contents.fontSize = this.standardFontSize() / 1;
	    } else {
	        this.changeTextColor(color1);
	        this.drawText(current, x1, y, valueWidth, 'right');
	    }
	};

	Window_MenuStatus.prototype.drawActorLevel = function(actor, x, y) {
	    this.changeTextColor(this.systemColor());
	    this.contents.fontSize = this.standardFontSize() / 1.5;
	    this.drawText(TextManager.levelA, x, y + 6, 48);
	    this.resetTextColor();
	    this.contents.fontSize = this.standardFontSize() * 1.5;
	    this.drawText(actor.level, x + 24, y, 36, 'right');
	    this.contents.fontSize = this.standardFontSize();
	};

	Window_MenuStatus.prototype.drawActorIcons = function(actor, x, y, width) {
	    width = width || 72;
	    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
	    for (var i = 0; i < icons.length; i++) {
	        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
	    }
	};


	Window_MenuStatus.prototype.update = function() {
		// Experimental sliding animation
		Window_Selectable.prototype.update.call(this);
		if (this.y > 0)
		{
			this.y = this.y - 3;
		}
	};


	//=============================================================================
	// Window_CommandLabel
	//=============================================================================

	function Window_CommandLabel() {
		this.initialize.apply(this, arguments);
	}

	Window_CommandLabel.prototype = Object.create(Window_Base.prototype);
	Window_CommandLabel.prototype.constructor = Window_CommandLabel;

	Window_CommandLabel.prototype.initialize = function(x, y, win) {
	    var width = this.windowWidth();
	    var height = this.windowHeight();
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	    this._commandWindow = win;
	    this._value = "";
	    this.refresh();
	};

	Window_CommandLabel.prototype.windowWidth = function() {
	    return Graphics.boxWidth;
	};

	Window_CommandLabel.prototype.windowHeight = function() {
	    return this.fittingHeight(1);
	};

	Window_CommandLabel.prototype.refresh = function() {
		if(this._value != this._commandWindow.currentData().symbol) {
			this._value = this._commandWindow.currentData().symbol;
		    var width = this.contents.width - this.textPadding() * 2;
		    this.contents.clear();
		    this.drawText(this._commandWindow.currentData().name, this.textPadding(), 0, width, 'center');

		    console.log(this._commandWindow);

		    var offset = (48 * (this._commandWindow.index() + 1));

		    this.x = (this._commandWindow.x - this.width / 2) + offset - 12;
		}
	};

	//=============================================================================
	// Window_MenuInfo
	//=============================================================================

	function Window_MenuInfo() {
		this.initialize.apply(this, arguments);
	};

	Window_MenuInfo.prototype = Object.create(Window_Base.prototype);
	Window_MenuInfo.prototype.constructor = Window_MenuInfo;

	Window_MenuInfo.prototype.initialize = function(x, y, win) {
	    Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
	    this._commandWindow = win;
	    this._text = '';
	};

	Window_MenuInfo.prototype.windowWidth = function() {
	    return Graphics.boxWidth;
	};

	Window_MenuInfo.prototype.windowHeight = function() {
    	return this.fittingHeight(1);
	};

	Window_MenuInfo.prototype.refresh = function() {
	    this.contents.clear();
	    var symbol = this._commandWindow.currentData().symbol;
	    this._text = _desc[symbol];
	    console.log(symbol);
	    this.drawTextEx(this._text, this.textPadding(), 0);

	    if (this.x < 0)
	    {
	    	this.x = this.x + 3;
	    };
	};

	//=============================================================================
	// Window_MenuGold
	//=============================================================================

	function Window_MenuGold() {
		this.initialize.apply(this, arguments);
	};

	Window_MenuGold.prototype = Object.create(Window_Gold.prototype);
	Window_MenuGold.prototype.constructor = Window_Gold;

	Window_Gold.prototype.windowWidth = function() {
	    return 256;
	};

	Window_Gold.prototype.refresh = function() {
	    var x = this.textPadding();
	    var width = this.contents.width - this.textPadding() * 2;
	    this.contents.clear();
	    // this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
	    this.contents.fontSize = this.standardFontSize() / 1.5;
	    this.drawText(this.currencyUnit(), 0, 3);
	    this.contents.fontSize = this.standardFontSize();
	    this.drawText($gameParty.gold(), 0, 0, 212, 'right');
	};

	//=============================================================================
	// Window_MenuPlaytime
	//=============================================================================

	function Window_MenuPlaytime() {
		this.initialize.apply(this, arguments);
	};

	Window_MenuPlaytime.prototype = Object.create(Window_Base.prototype);
	Window_MenuPlaytime.prototype.constructor = Window_MenuPlaytime;

	Window_MenuPlaytime.prototype.initialize = function(x, y) {
	    var width = this.windowWidth();
	    var height = this.windowHeight();
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	    this.refresh();
	};

	Window_MenuPlaytime.prototype.windowWidth = function() {
    return 256;
	};

	Window_MenuPlaytime.prototype.windowHeight = function() {
	    return this.fittingHeight(1);
	};

	Window_MenuPlaytime.prototype.refresh = function(){
		this.contents.clear();
		this.contents.fontSize = this.standardFontSize() / 1.5;
		this.drawText("Playtime", 0, 3);
		this.contents.fontSize = this.standardFontSize();
		this.drawText($gameSystem.playtimeText(), 96, 0);

	};

})();
