package com.mosheyu;

import com.mosheyu.service.BoardService;
import com.mosheyu.ws.MoSheWebSocket;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages="com.mosheyu.*.*")
@MapperScan("com.mosheyu.dao")
@ComponentScan(basePackages = {"com.mosheyu.controller","com.mosheyu.service",
                            "com.mosheyu.typehandler",
                            "com.mosheyu.ws","com.mosheyu.config"})
public class ChessCpApplication {

    public static void main(String[] args) {
//        SpringApplication.run(ChessCpApplication.class, args);


        ApplicationContext applicationContext =  SpringApplication.run(ChessCpApplication.class, args);

        // 获取Spring IOC容器中的Service并注入
        BoardService boardService = applicationContext.getBean(BoardService.class);
        MoSheWebSocket.setMyService(boardService);

    }

}
