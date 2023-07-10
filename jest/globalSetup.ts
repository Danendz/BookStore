import 'tsconfig-paths/register'
import { createUserRaw } from '@/__tests__/utils'

const globalFunc = async () => {
  await createUserRaw()
}

export default globalFunc
