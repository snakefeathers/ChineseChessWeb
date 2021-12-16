package com.mosheyu.service.impl;

import com.mosheyu.dao.DiscussDao;
import com.mosheyu.domain.Discuss;
import com.mosheyu.service.DiscussService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "DiscussService")
public class DiscussServiceImpl implements DiscussService {

    //页码从1开始
    //一页的大小
    int PAGESIZE = 10;


    @Autowired
    private DiscussDao discussDao;

    @Override
    public List<Discuss> show(int pageNo) {
        //根据页码，计算数据起始位置。
        int dateOrigin = (pageNo-1)*PAGESIZE;
        return discussDao.show(dateOrigin,PAGESIZE);
    }

    @Override
    public List<Discuss> selectByInviId(String invitationId) {
        return discussDao.selectByInviId(invitationId);
    }

    @Override
    public List<Discuss> showByUserName(String userName) {
        return discussDao.showByUserName(userName);
    }


    @Override
    public boolean discussAdd(Discuss discuss) {

        return discussDao.discussAdd(discuss);
    }

    @Override
    public boolean deleteById(String discussId) {
        return discussDao.deleteById(discussId);
    }
}
