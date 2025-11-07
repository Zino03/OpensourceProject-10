package com.example.demo;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.question.Question;
import com.example.demo.question.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
class DemoApplicationTests {

	@Autowired
	private QuestionRepository questionRepository;

	@Test
	void testJpa() {
		Question q1 = new Question();
		q1.setSubject("sbb???");
		q1.setContent("sbb에 대해 알려줘");
		q1.setCreateDate(LocalDateTime.now());
		this.questionRepository.save(q1);
		
		Question q2 = new Question();
		q2.setSubject("spring boot???");
		q2.setContent("spring boot에 대해 알려줘");
		q2.setCreateDate(LocalDateTime.now());
		this.questionRepository.save(q2);
	}

}
