package com.mosheyu.service;

import com.mosheyu.domain.Invitation;

import java.util.List;

public interface InvitationService {

    public List<Invitation> show(int pageNo);

    public List<Invitation> showByUserName(String userName,int pageNo);



    public List<Invitation> announcementShow();

    public Invitation selectById(String invitationId);

    public boolean addInvitation(Invitation invitation);

    public boolean updateInvitation(Invitation invitation);

    public boolean updateStatus(Invitation invitation);


    public boolean deleteById(String invitationId);




}
