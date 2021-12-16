package com.mosheyu.domain;

public class Board {
    private String boardId;
    private String boardDetail;
    private long creationTime;
    private String userNameA;
    private String userNameB;
    private int win;
    private long elapsed;
    private int status;


    public Board() {
    }

    @Override
    public String toString() {
        return "Board{" +
                "boardId='" + boardId + '\'' +
                ", boardDetail='" + boardDetail + '\'' +
                ", creationTime=" + creationTime +
                ", userNameA='" + userNameA + '\'' +
                ", userNameB='" + userNameB + '\'' +
                ", win=" + win +
                ", elapsed=" + elapsed +
                ", status=" + status +
                '}';
    }

    public String getBoardId() {
        return boardId;
    }

    public void setBoardId(String boardId) {
        this.boardId = boardId;
    }

    public String getBoardDetail() {
        return boardDetail;
    }

    public void setBoardDetail(String boardDetail) {
        this.boardDetail = boardDetail;
    }

    public long getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(long creationTime) {
        this.creationTime = creationTime;
    }

    public String getUserNameA() {
        return userNameA;
    }

    public void setUserNameA(String userNameA) {
        this.userNameA = userNameA;
    }

    public String getUserNameB() {
        return userNameB;
    }

    public void setUserNameB(String userNameB) {
        this.userNameB = userNameB;
    }

    public int getWin() {
        return win;
    }

    public void setWin(int win) {
        this.win = win;
    }

    public long getElapsed() {
        return elapsed;
    }

    public void setElapsed(long elapsed) {
        this.elapsed = elapsed;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
