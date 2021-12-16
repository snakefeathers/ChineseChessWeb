package com.mosheyu.service;

import com.mosheyu.domain.Board;

import java.util.List;

public interface BoardService {

    public List<Board> show(int pageNo);


    public boolean deleteById(String boardId);



    public boolean saveBoard(Board board);


}
