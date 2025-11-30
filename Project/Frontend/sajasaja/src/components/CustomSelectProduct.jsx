import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa'; 

// 박스 전체 컨테이너
const Container = styled.div`
  position: relative;
  font-size: 11px;
  user-select: none;
  width: 70px;
`;

// 닫혀있을 때 보이는 박스
const SelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background-color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #aaa;
  }
`;

// 펼쳐지는 옵션 목록
const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  margin-top: 2px;
  padding: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  list-style: none;
  overflow: hidden;
  z-index: 100;

  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

// 개별 옵션
const OptionItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  color: ${props => props.$selected ? '#000' : '#666'};
  font-weight: ${props => props.$selected ? '600' : '400'};
  background-color: ${props => props.$selected ? '#f5f5f5' : '#fff'};

  &:hover {
    background-color: #f5f5f5; 
    color: #FF7E00;
  }
`;

const CustomSelectProduct = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // 현재 선택된 라벨 찾기
  const selectedOption = options.find(opt => opt.value === value);
  const currentLabel = selectedOption ? selectedOption.label : options[0].label;

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <Container ref={ref}>
      <SelectBox $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {currentLabel}
        <FaChevronDown size={10} color="#888" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
      </SelectBox>
      
      <DropdownList $isOpen={isOpen}>
        {options.map((option) => (
          <OptionItem 
            key={option.value}
            $selected={value === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </OptionItem>
        ))}
      </DropdownList>
    </Container>
  );
};

export default CustomSelectProduct;