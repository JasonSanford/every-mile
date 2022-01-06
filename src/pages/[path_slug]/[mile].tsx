import { GetStaticProps, GetServerSideProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { serializePathAndMile } from '../../utils'

const Mile = () => {
  const router = useRouter()

  const serialized = serializePathAndMile(router.query)
  console.log('router.query', router.query)
  
  if (!serialized) {
    return <p>nope</p>
  }
  
  const { path, mile } = serialized
  return (
    <ul>
      <li>
        {path} Mile {mile}
      </li>
    </ul>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return new Promise((resolve) => {
//     resolve({
//       paths: [
//         { params: { path: 'at', mile: '3' } }
//       ],
//       fallback: false
//     })
//   });
// };

export default Mile

// export const getStaticProps: GetStaticProps = async ({ response, params }) => {
//   // const postData = await getPostData(params.id as string)
//   const mile = params?.mile as string
//   return {
//     props: {
//       mile
//     }
//   }
// }
