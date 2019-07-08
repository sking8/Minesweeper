$(document).ready(() =>{
	let width=9;
	let height=9;
	let num_bomb=10;
	let bomb_size=16;
	let board=[];
	let squares=$('.grid-item');
	let c = 0;
	let t;
	let square_safe;
	let bomb_left;
	let scores=[];


	let square = function (x,y){
		this.x=x;
		this.y=y;
		this.is_bomb=false;
		this.dist=0;
		this.state=false; //false means hidden
	};

	let score = function (board_size, num_bomb, time){
		this.board_size=board_size;
		this.num_bomb=num_bomb;
		this.time=time;
	};

	update_panel();

	function update_bomb(num){
		bomb_left=num;
		suqare_safe=width*height-num;
	};


	function update_panel(){
		stopCount();
		c=0;
		$('#timer').text(c);
		$("#reset-face").html('<img src="smile-regular.svg">');
		$('.grid-container').css({ width : width*bomb_size});
		$('.grid-container').css({ height : height*bomb_size});
		$('#board-header').css({ width : width*bomb_size});
		$('#num-mines').max=width*height-1;

		if(num_bomb>width*height-1){
			num_bomb=width*height-1;
		}

		update_bomb(num_bomb);

		$('#left-mines').text(num_bomb);
		$('.grid-container').html('');

		for (let i = 0; i < height; i++){
			board[i] =[];
			for (let j = 0; j < width; j++){
				board[i][j] = new square(i, j); //i is column and j is row no.

				tmp='<div class="grid-item"'+' row='+i.toString()+' col='+j.toString()+'></div>';

				$('.grid-container').append(tmp);
			}
		}

		addMines();

		squares=$('.grid-item');

		$(".grid-item").click(function(e){
			if(c==0){
				startCount();
			}
			x=parseInt(this.getAttribute( 'row' ));
			y=parseInt(this.getAttribute( 'col' ));
			target=board[x][y];

			if(e.shiftKey){
				if(this.innerHTML=='f'){
					target.state=false;
					this.innerHTML='';
					this.style.background='rgba(255, 255, 255, 0.8)';
					$('#left-mines').text(parseInt($('#left-mines').text())+1);
					if(target.is_bomb){
						bomb_left++;
					}
				}else if(!target.state){
					target.state=true;
					this.innerHTML='f';
					this.style.background='yellow';
					$('#left-mines').text(parseInt($('#left-mines').text())-1);

					if(target.is_bomb){
						bomb_left--;
					}

				}
			}else{
				if(!target.state){
					if(target.is_bomb){
						this.style.background='red';
						gameOver();
					}else if(target.dist==0){
						clear(x,y,squares);
						//alert(suqare_safe+'  1');
					}else{
						target.state=true;
						suqare_safe--;
						//alert(suqare_safe+'  2');
						this.style.border='inset';
						this.innerHTML=target.dist;
					}
				}
			}

			if(suqare_safe==0 && bomb_left==0){
				win();
			}
			
		});
	};

	function win(){
		alert('you win!');
		gameOver();
		scores.push(new score(width*height, num_bomb, c));
		scores.sort(function(a, b){return a.time - b.time});
		drawScore();
		$("#reset-face").html('<img src="smile-regular.svg">');
	};

	function drawScore(){
		score_board=$('#score-container');
		score_board.html('');
		for(let i=0;i<scores.length;i++){
			let s=scores[i];
			score_board.append('<div class="score-item">'+(i+1)+": Size of Panel: "+s.board_size+"; Number of Bombs: "+s.num_bomb+ "; Time Passed: " +(s.time-1)+';</div>');
		}
	};


	function clear(x,y){
		if(!board[x][y].state){
			board[x][y].state=true;
			num=x*width+y;
			tmp=squares[num];
			tmp.style.border='inset';
			suqare_safe--;

			if(board[x][y].dist!=0){
				tmp.innerHTML=board[x][y].dist;
			}else{
				for(let i=-1;i<2;i++){
					for(let j=-1;j<2;j++){
						if(x+i>=0 && x+i<height && y+j>=0 && y+j<width){
							clear(x+i,y+j);
						}
					}
				}
			}
		}	
	}

	function addMines(){
		let x=0;
		let y=0;
		let i=0;

		while(i<num_bomb){
			x=Math.floor(Math.random() * height);
			y=Math.floor(Math.random() * width);
			if(!board[x][y].is_bomb){
				board[x][y].is_bomb=true;
				i++;

				//add distance to neighboring squares
				for(let k=-1;k<2;k++){
					for(let l=-1;l<2;l++){
						if(x+k>=0 && x+k<height && y+l>=0 && y+l<width){ //check if the neighbor suqares are within range			
							board[x+k][y+l].dist++;
						}
					}
				}
			}
		}
	};



	function gameOver(){
		stopCount();
		squares=$('.grid-item');
		$("#reset-face").html('<img src="frown-solid.svg">');

		for(let i=0;i<height;i++){
			for(let j=0;j<width;j++){
				if(!board[i][j].state){
					board[i][j].state=true;
					squares[i*width+j].style.border='inset';
					if(board[i][j].is_bomb){
						squares[i*width+j].innerHTML='B';
					}else if(board[i][j].dist!=0){
						squares[i*width+j].innerHTML=board[i][j].dist;
					}

				}

			}
		}
	}

	function timedCount() {
		$('#timer').text(c);
		c = c + 1;
		t = setTimeout(timedCount, 1000);
	}

	function startCount() {
		c=0;
		timedCount();
	}

	function stopCount() {
		clearTimeout(t);
	}
	
	//update panel with different difficulty levels
	$('#difficulty').change((e)=>{
		if($( "#difficulty option:selected" ).text()=="Custom"){
			$('.slide-container ').show();
		}else{
			$('.slide-container ').hide();
			if($( "#difficulty option:selected" ).text()=="Beginner"){
				width=9;
				height=9;
				num_bomb=10;
			}else if($( "#difficulty option:selected" ).text()=="Intermediate"){
				width=16;
				height=16;
				num_bomb=40;
			}else{
				width=24;
				height=24;
				num_bomb=99;
			}
			update_panel();
		}
	});


	$("#reset-face").click(function(){
		update_panel();
	});




	
	// Update the current slider value (each time you drag the slider handle)

	$('#width').change(function() {
		width= this.value;
		update_panel();
	});

	$('#height').change(function() {
		height= this.value;
		update_panel();
	});

	$('#num-mines').change(function() {
		num_bomb= this.value;
		update_panel();
	});


});