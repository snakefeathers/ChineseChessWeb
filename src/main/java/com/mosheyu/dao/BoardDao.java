package com.mosheyu.dao;

import com.mosheyu.domain.Board;
import com.mosheyu.domain.Invitation;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;




@Repository
public interface BoardDao {

    //根据页码查找数据,一页10条数据
    @Select("select boardId,boardDetail,creationTime,userNameA,userNameB,win,elapsed,status   " +
            "from board  limit #{dateOrigin}, #{pageSize}")
    @Results({
            @Result(id = true,column = "boardId",property = "boardId"),
            @Result(column = "boardDetail",property = "boardDetail"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "userNameA",property = "userNameA"),
            @Result(column = "userNameB",property = "userNameB"),
            @Result(column = "win",property = "win"),
            @Result(column = "elapsed",property = "elapsed"),
            @Result(column = "status",property = "status")

    })
    public List<Board> show(@Param("dateOrigin") int dateOrigin, @Param("pageSize")int pageSize);

    //添加
    @Insert("insert into board (boardId,boardDetail,creationTime,userNameA,userNameB,win,elapsed,status)" +
            "values(#{board.boardId},#{board.boardDetail},#{board.creationTime},#{board.userNameA}," +
            "#{board.userNameB},#{board.win},#{board.elapsed},#{board.status});")
    public boolean addBoard(@Param("board") Board board);



    //删除棋局
    @Delete("delete from board where boardId = #{boardId}")
    public boolean deleteById(@Param("boardId") String boardId);
}
