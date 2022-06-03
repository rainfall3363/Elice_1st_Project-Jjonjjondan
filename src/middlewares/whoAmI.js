import jwt from 'jsonwebtoken';

function whoAmI(req, res, next) {
  const userToken = req.headers['authorization']?.split(' ')[1];

  // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임.
  // jwt 토큰을 전달 받지 못했다면, 비회원(guest)인 상태로 진행
  if (!userToken || userToken === 'null') {
    req.currentUserId = 'guest';
    req.currentRole = 'guest';
    next();
  } else {
    try {
      const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
      const jwtDecoded = jwt.verify(userToken, secretKey);
      const userId = jwtDecoded.userId;
      const role = jwtDecoded.role;
      // 라우터에서 req.currentUserId를 통해 유저의 id에 접근 가능하게 됨
      req.currentUserId = userId;
      req.currentRole = role;
      next();
    } catch (e) {
      // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
      // 403 코드로 JSON 형태로 프론트에 전달함.
      res.status(403).json({
        result: 'forbidden-approach',
        reason: '정상적인 토큰이 아닙니다.',
      });
      return;
    }
  }
}

export { whoAmI };
