package com.mosheyu.service.impl;


import com.mosheyu.dao.BoardDao;
import com.mosheyu.domain.Board;
import com.mosheyu.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "BoardService")
public class BoardServiceImpl implements BoardService {

    //页码从1开始
    //一页的大小
    int PAGESIZE = 10;


    @Autowired
    private BoardDao boardDao;

    @Override
    public List<Board> show(int pageNo) {
        //根据页码，计算数据起始位置。
        int dateOrigin = (pageNo-1)*PAGESIZE;
        return boardDao.show(dateOrigin,PAGESIZE);
    }

    @Override
    public boolean deleteById(String boardId) {
        return boardDao.deleteById(boardId);
    }

    @Override
    public boolean saveBoard(Board board) {
        boolean b = boardDao.addBoard(board);

        return b;
    }
}
