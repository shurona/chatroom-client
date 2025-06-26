
export async function signUpUser(data: {
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('회원가입에 실패했습니다.');
  }

  return response.json();
}