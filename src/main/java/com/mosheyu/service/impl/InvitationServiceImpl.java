package com.mosheyu.service.impl;

import com.mosheyu.dao.InvitationDao;
import com.mosheyu.domain.Invitation;
import com.mosheyu.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "InvitationService")
public class InvitationServiceImpl implements InvitationService {

    //页码从1开始
    //一页的大小
    int PAGESIZE = 10;

    @Autowired
    private InvitationDao invitationDao;
    @Override
    public List<Invitation> show(int pageNo) {
        //根据页码，计算数据起始位置。
        int dateOrigin = (pageNo-1)*PAGESIZE;
        return invitationDao.show(dateOrigin,PAGESIZE);
    }

    @Override
    public List<Invitation> showByUserName(String userName,int pageNo) {
        //根据页码，计算数据起始位置。
        int dateOrigin = (pageNo-1)*PAGESIZE;
        return invitationDao.showByUserName(userName,pageNo,PAGESIZE);
    }

    @Override
    public List<Invitation> announcementShow() {
        return invitationDao.announcementShow();
    }

    @Override
    public Invitation selectById(String invitationId) {
        return invitationDao.selectById(invitationId);
    }

    @Override
    public boolean addInvitation(Invitation invitation) {
        return invitationDao.addInvitation(invitation);
    }

    @Override
    public boolean updateInvitation(Invitation invitation) {
        //判断是否存在这个ID的帖子
        boolean isExistInvitation =invitationDao.isExistInvitation(invitation.getInvitationId());
        System.out.println(isExistInvitation);
//        if (isExistInvitation){
//            System.out.println("该帖子存在，修改该帖子。");
//            return invitationDao.updateInvitation(invitation);
//        }else {
//            System.out.println("该帖子不存在，不修改，直接添加。");
//            return invitationDao.addInvitation(invitation);
//        }
        return invitationDao.updateInvitation(invitation);
    }

    @Override
    public boolean updateStatus(Invitation invitation) {
        return invitationDao.updateStatus(invitation);
    }

    @Override
    public boolean deleteById(String invitationId) {
        return invitationDao.deleteById(invitationId);
    }




}
