//版权所有者suifeng，使用须注明出处。如有问题请发送email至1975658536@qq.com

function $(id) {
	return document.getElementById(id);
}

/**
 *贪吃蛇类
 */
var Snake = {
	/**
	 * s_body: 蛇身数组，存放蛇身的每一节数据
	 * 结构：{x:x0, y:y0, color:color0}
	 * x,y表示坐标；color表示颜色 
	 */
	s_body: [],
	/**
	 * direction：当前移动的方向值为0，1，2，3；
	 * 0（左），1（上），2（右），3（下）
	 * 可通过方向键改变它的值
	 */
	direction: 0,
	timer: null,	//定时器
	speed: 100,		//移动速度
	paused: true,	//是否暂停
	//游戏窗口大小
	rowNumber: 25,
	colNumber: 25,
	tableView: null,
	flag: true,
	colors:["#ff0000", "#00ff00", "#0000ff"],
	//初始化函数
	init: function() {		
		var x = 1;
		var y = 0;
		this.direction = 2;
		this.foodCount = 0;
		this.tableView = $("table_view");
		//构建游戏视图
		for (var i=0; i<this.rowNumber; i++) {
			var tr = this.tableView.insertRow(-1);
			for (var j=0; j<this.colNumber; j++) {
				var td = tr.insertCell(-1);
			}
		}
		//初始化蛇
		this.s_body.push({x:1, y:0, color:"#333333"});	//蛇头
		this.s_body.push({x:0, y:0, color:"#555555"});	//蛇尾
		this.drawSnake();
		this.produceFood();		//初始化食物
		this.paused = true;	
		this.flag = true;
		//添加键盘事件
		document.onkeydown = function(e) {
			if (Snake.flag) {
				Snake.flag = false;
				e = e ? e : window.event;
				if(37 == e.keyCode) {
					if (2 != Snake.direction)
						Snake.direction = 0;
				} else if(38 == e.keyCode) {
					if (3 != Snake.direction)
						Snake.direction = 1;
				} else if(39 == e.keyCode) {
					if (0 != Snake.direction)
						Snake.direction = 2;
				} else if(40 == e.keyCode) {
					if (1 != Snake.direction)
						Snake.direction = 3;
				}
			}
		};
	},

	//检查一个格子是否被填充
	isFilled: function(x, y) {
		if ("" == this.tableView.rows[y].cells[x].style.backgroundColor) {
			return false;
		}
		return true;
	},

	//产生食物
	produceFood: function() {
		var x = Math.floor(Math.random()*this.colNumber);
		var y = Math.floor(Math.random()*this.rowNumber);
		var index = Math.floor(Math.random()*this.colors.length);
		if (!this.isFilled(x, y)) {			
			this.tableView.rows[y].cells[x].style.backgroundColor = this.colors[index];
		} else {
			this.produceFood();
		}
	},

	//绘制一个格子
	drawCell: function(x, y, color) {
		this.tableView.rows[y].cells[x].style.backgroundColor = color;
	},

	//绘制蛇身
	drawSnake: function(){
        for(var i=0; i<this.s_body.length; i++){
            this.drawCell(this.s_body[i].x, this.s_body[i].y,this.s_body[i].color);
        }
    },

    //擦除蛇身
    wipeSnake: function() {
    	this.tableView.rows[this.s_body[this.s_body.length-1].y].cells[this.s_body[this.s_body.length-1].x].style.backgroundColor = "";
    },

    //获得蛇头将要到达的下一格的坐标
    getNextPoint: function() {
    	var x = this.s_body[0].x;
    	var y = this.s_body[0].y;
    	if (0 == this.direction) {
    		x--;
    	} else if(1 == this.direction) {
    		y--;
    	} else if(2 == this.direction) {
    		x++;
    	} else if(3 == this.direction) {
    		y++;
    	}
    	return {x:x, y:y};
    },

    //检查下一个点的位置
    checkNextPoint: function() {
    	var point = this.getNextPoint();
    	var x = point.x;
    	var y = point.y;
    	if (x<0 || x>=this.colNumber || y<0 || y>=this.rowNumber) {	//判断是否超出边界
    		return -1;	
    	}
    	for(var i=0; i<this.s_body.length-1; i++) {
    		if (x==this.s_body[i].x && y==this.s_body[i].y) {		//判断是否撞上自己
    			return -1;
    		}
    	}
    	if (this.isFilled(x, y)) {									//判断是否有食物
    		return 1;
    	}
    	return 0;
    },

    //获得一个格子的背景颜色
    getCellColor: function(x, y) {
    	return this.tableView.rows[y].cells[x].style.backgroundColor;
    },

    //蛇移动一格
    moveOneCell: function() {
    	var checked = this.checkNextPoint();
    	if (-1 == checked) {
    		clearInterval(this.timer);			//清除定时器
    		alert("游戏结束!!! \n请重新开始新游戏...");
    		$("btn_start").disabled = true;
    		return;
    	} else {
    		var point = this.getNextPoint();
    		var color = this.s_body[0].color;	//保存蛇头颜色
    		if(1 == checked) {
    			var _color = this.getCellColor(point.x, point.y);	//获取食物颜色
	    		this.s_body[0].color = _color;
	    		this.s_body.unshift({x:point.x, y:point.y, color:color});
	    		Snake.drawSnake();
	    		this.produceFood();			//产生新的食物
	    	} else {	    		
	    		for(var i=0; i<this.s_body.length-1; i++) {
	    			this.s_body[i].color = this.s_body[i+1].color;	//颜色向前移动
	    		}
	    		this.s_body.pop();				//蛇尾减一节
	    		this.s_body.unshift({x:point.x, y:point.y, color:color});	//蛇头加一节
	    		Snake.drawSnake();
    		}
    		this.flag = true;
    	}	
    },

    //蛇的移动函数
    moveSnake: function() {
    	this.timer = setInterval(function() {
    		Snake.wipeSnake();
    		Snake.moveOneCell();   		
    	}, this.speed);
    },

    //暂停函数
    pause: function() {
    	clearInterval(Snake.timer);
    },

    //重新开始
    restart: function() {
        if(this.timer) {
            clearInterval(this.timer);
        }
        for(var i=0; i<this.rowNumber; i++) {
          this.tableView.deleteRow(0);
        }
        this.s_body = [];
        this.init();
    }
};