package com.mosheyu.typehandler;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class dateTypeHandler implements TypeHandler<Date> {
    @Override
    public void setParameter(PreparedStatement preparedStatement, int i, Date date, JdbcType jdbcType) throws SQLException {
//        String s = DateFormat.getDateTimeInstance(DateFormat.MEDIUM,DateFormat.MEDIUM).format(date);              //2021-9-20 17:48:40   不能补0
        String s =  new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(date);
        preparedStatement.setString(i,s);
    }

    @Override
    public Date getResult(ResultSet resultSet, String s) throws SQLException {
        return null;
    }

    @Override
    public Date getResult(ResultSet resultSet, int i) throws SQLException {
        return null;
    }

    @Override
    public Date getResult(CallableStatement callableStatement, int i) throws SQLException {
        return null;
    }
}
