package com.mosheyu.controller;


import com.mosheyu.domain.Board;
import com.mosheyu.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/board")
public class BoardController {

    @Autowired
    private BoardService boardService;


    @RequestMapping("/show")
    @ResponseBody
    public List<Board> boardShow(){
        List<Board> boardList = null;
        return boardList;
    }

    public boolean save(Board board){

        return boardService.saveBoard(board);
    }



}
