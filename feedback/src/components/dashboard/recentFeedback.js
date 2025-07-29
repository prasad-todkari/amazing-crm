import getColorFromString from "../common/getColor";
import getInitials from "../common/getInitials";
import { timeAgo } from "../common/DateFormat";

export default function RecentFeedback({ feedbackList = [], questionList = [] }) {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-100 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg">
        <div className="p-6 border-b border-slate-300 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
          <a
            href="/feedback"
            className="text-slate-600 hover:underline text-sm font-medium"
          >
            View All
          </a>
        </div>
        <div className="p-6 space-y-4">
          {feedbackList.length === 0 ? (
            <p className="text-sm text-gray-500">No feedback available.</p>
          ) : (
            feedbackList.map((fb, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 pb-4 border-b border-slate-300 last:border-b-0 last:pb-0"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
                  style={{ backgroundColor: getColorFromString(getInitials(fb.name) || '') }}
                >
                  {getInitials(fb.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{fb.name}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${fb.status === 'satisfied'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-rose-100 text-rose-800'
                        }`}
                    >
                      {fb.status === 'satisfied' ? 'Satisfied' : 'Not Satisfied'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {fb.comment}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`ri-star-${i < fb.rating ? 'fill' : 'line'} text-sm`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">{parseFloat(fb.rating || 0).toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500">{timeAgo(new Date(fb.time || Date.now()))}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-100 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Questions Overview</h3>
          <button className="text-sm text-slate-600 hover:underline font-medium transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Most Answered Questions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Count</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg. Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {questionList.map((question, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{question.question_text}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-800">{question.count}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${parseFloat(question.avg) > 4
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(question.avg) >= 3
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {parseFloat(question.avg).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}