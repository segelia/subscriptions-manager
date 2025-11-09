import styled from "styled-components";

export const SubscriptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;


export const MessageWrapper = styled.div`
  font-family: "Arial", sans-serif;
`;

export const ErrorWrapper = styled.div`
  font-family: "Arial", sans-serif;
  color: red;
`;
