import FindStudentRoomView from 'sections/find-student-room/view/find-student-room-view';
import { SettingService } from 'services';

export const metadata = {
  title: 'Exam Room Finder | Coochbehar College',
  description: 'Quickly locate your assigned examination room.',
};

export default async function Page() {
  let studentLabel = 'Registration Number';
  let examType = 'test';

  try {
    const labelRes = await SettingService.getSettingByKey('student-label');
    console.log(labelRes);
    if (labelRes?.success && labelRes?.data?.value) {
      console.log("Student Label: ", studentLabel);
      studentLabel = labelRes.data.value;
      console.log("Server Student Label: ", labelRes.data.value);
    }
  } catch (err) {
    console.error('Error fetching student-label setting during SSR:', err);
  }

  try {
    const examTypeRes = await SettingService.getSettingByKey('exam-type');
    console.log(examTypeRes);
    if (examTypeRes?.success && examTypeRes?.data?.value) {
      console.log("Exam Type: ", examType);
      examType = examTypeRes.data.value;
      console.log("Server Exam Type: ", examTypeRes.data.value);
    }
  } catch (err) {
    console.error('Error fetching exam-type setting during SSR:', err);
  }

  return (
    <FindStudentRoomView 
      studentLabel={studentLabel} 
      examType={examType} 
    />
  );
}
