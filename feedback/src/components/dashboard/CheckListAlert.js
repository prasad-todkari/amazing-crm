import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    Users
} from 'lucide-react';
import { getDayChecklist } from '../../services/ChekListServices';

const ChecklistAlertCard = () => {
    const [checklistData, setChecklistData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resp = async () => {
            try {
                const data = await getDayChecklist();
                setChecklistData(data.data);
            } catch (err) {
                console.error('Checklist fetch failed', err);
            } finally {
                setLoading(false);
            }
        };
        resp();
    }, []);

    const calculateStats = () => {
        let totalPending = 0;
        let totalCompleted = 0;
        let totalChecklistCount = 0;

        checklistData.forEach(site => {
            const checklists = ['openingChecklist', 'closingChecklist'];

            checklists.forEach(type => {
                if (site[type]) {
                    totalChecklistCount++;
                    site[type].completed ? totalCompleted++ : totalPending++;
                }
            });
        });

        return {
            sites: checklistData.length,
            totalPending,
            totalCompleted,
            totalChecklistCount
        };
    };

    const getUrgencyLevel = (pending, total) => {
        if (total === 0) return 'low';

        const pendingRate = (pending / total) * 100;

        if (pendingRate >= 60) return 'high';
        if (pendingRate >= 30) return 'medium';
        return 'low';
    };

    const stats = calculateStats();
    const completionRate = stats.totalChecklistCount > 0
        ? Math.round((stats.totalCompleted / stats.totalChecklistCount) * 100)
        : 0;
    const urgencyLevel = getUrgencyLevel(stats.totalPending, stats.totalChecklistCount);


    const handleSiteClick = (siteId, formId) => {

        const site = checklistData.find(s => s.siteId === siteId);
        if (!site) return;

        //     const checklistId = site[`${checklistType}Checklist`]?.checklistId;
        //     if (!checklistId) {
        //         console.warn('Checklist ID not found');
        //     return;
        //   }

        const params = new URLSearchParams({
            siteId,
            formId
        }).toString();
        console.log('Navigating to checklist:', params);
        window.location.href = `/checklist?${params}`;
    };

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Main Alert Card - 1/4 on md+ */}
                <div
                    className={`
          w-full md:w-1/4
          bg-gradient-to-br cursor-pointer
          border rounded-xl p-4 shadow-sm hover:shadow-md
          ${urgencyLevel === 'high'
                            ? 'from-red-50 to-red-100 border-red-200'
                            : urgencyLevel === 'medium'
                                ? 'from-yellow-50 to-yellow-100 border-yellow-200'
                                : 'from-green-50 to-green-100 border-green-200'
                        }
        `}
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                                <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${urgencyLevel === 'high'
                                        ? 'bg-red-100 text-red-600'
                                        : urgencyLevel === 'medium'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'bg-green-100 text-green-600'
                                    }
              `}>
                                    {stats.totalPending === 0 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">Checklist Status</h3>
                                    <p className="text-xs text-gray-600 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Updated now
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                                <div className={`
                text-xl font-bold
                ${urgencyLevel === 'high' ? 'text-red-700' : urgencyLevel === 'medium' ? 'text-yellow-700' : 'text-green-700'}
              `}>
                                    {stats.totalPending}
                                </div>
                                <div className="text-xs text-gray-600">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-700">{stats.totalCompleted}</div>
                                <div className="text-xs text-gray-600">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-purple-700">{stats.sites}</div>
                                <div className="text-xs text-gray-600">Sites</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-1">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`
                  h-1.5 rounded-full
                  ${urgencyLevel === 'high' ? 'bg-red-500' : urgencyLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                `}
                                    style={{ width: `${completionRate}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className={`
                                        text-xs font-medium mt-2
                                            ${urgencyLevel === 'high' ? 'text-red-700' : urgencyLevel === 'medium' ? 'text-yellow-700' : 'text-green-700'}
                                        `}>
                            {stats.totalPending === 0
                                ? '🎉 All completed!'
                                : `⚠️ ${stats.totalPending} need${stats.totalPending === 1 ? 's' : ''} attention`
                            }
                        </div>
                    </div>
                </div>

                {/* Right Side - Sites Requiring Attention */}
                {stats.totalPending > 0 && (
                    <div className="w-full md:w-3/4">
                        <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            Sites Requiring Attention
                        </h4>

                        {/* Grid on larger, scroll on small screens */}
                        <div className="grid grid-cols-2 my-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 overflow-x-auto">
                            {checklistData
                                .filter(site => !site.openingChecklist.completed || !site.closingChecklist.completed)
                                .map(site => (
                                    <div
                                        key={site.siteId}
                                        className="bg-slate-100 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className='w-6 h-6 bg-white rounded-lg flex items-center justify-center hover:shadow-md transition'>
                                                <MapPin className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm mb-1 font-medium text-gray-900 truncate">{site.siteName}</h5>
                                                <p className="text-xs text-gray-500 mb-2">ID: site_afz{site.siteId}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1 mb-1">
                                            {site.openingChecklist && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSiteClick(site.siteId, site.openingChecklist.id);
                                                    }}
                                                    className={`
                                                        flex-1 px-2 py-1 rounded text-xs font-medium
                                                        ${site.openingChecklist.completed
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }
                      `}
                                                >
                                                    Opening {site.openingChecklist.completed ? '✓' : '✗'}
                                                </button>
                                            )}
                                            {site.openingChecklist && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSiteClick(site.siteId, site.closingChecklist.id);
                                                    }}
                                                    className={`
                                                            flex-1 px-2 py-1 rounded text-xs font-medium
                                                            ${site.closingChecklist.completed
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }
                        `}
                                                >
                                                    Closing {site.closingChecklist.completed ? '✓' : '✗'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChecklistAlertCard;