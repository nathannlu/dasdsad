import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledLink = styled(props => <Link {...props} />)`color: #006aff;`;

export default StyledLink;
